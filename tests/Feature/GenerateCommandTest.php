<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

uses(Tests\TestCase::class);

beforeEach(function () {
    // Create test output path
    $this->outputPath = storage_path('lingua_test_' . Str::random(10) . '.js');
    File::makeDirectory(dirname($this->outputPath), 0777, true, true);

    // Create test language file
    $this->langPath = lang_path('uk/messages.php');
    File::makeDirectory(dirname($this->langPath), 0777, true, true);
    File::put($this->langPath, "<?php\n\nreturn ['hello' => 'Привіт Світе'];");
});

afterEach(function () {
    // Clean up test files
    File::delete($this->langPath);
    File::delete($this->outputPath);
    File::delete(lang_path('uk.json'));
});

test('it can compile php locale files', function () {
    // Run the command
    $this->artisan('lingua:generate', ['path' => $this->outputPath])
        ->assertExitCode(0);

    // Verify file exists
    expect($this->outputPath)->toBeFile();

    // Get file content
    $content = File::get($this->outputPath);

    // Verify file structure and content
    expect($content)
        ->toContain('const Lingua = { translations: {')
        ->toContain('export { Lingua }')
        ->toContain('"uk":{"php":{"messages":{"hello":"\u041f\u0440\u0438\u0432\u0456\u0442 \u0421\u0432\u0456\u0442\u0435"}}')
        ->toContain('"hello":"\u041f\u0440\u0438\u0432\u0456\u0442 \u0421\u0432\u0456\u0442\u0435"');
});

test('it can compile both php and json locale files for the same locale', function () {
    // Create JSON file for the same locale
    $jsonContent = json_encode([
        'welcome' => 'Ласкаво просимо',
        'nested' => [
            'key' => 'Вкладене значення'
        ]
    ]);
    File::put(lang_path('uk.json'), $jsonContent);

    // Run the command
    $this->artisan('lingua:generate', ['path' => $this->outputPath])
        ->assertExitCode(0);

    // Verify file exists
    expect($this->outputPath)->toBeFile();

    // Get file content
    $content = File::get($this->outputPath);

    // Verify file structure and content
    expect($content)
        ->toContain('const Lingua = { translations: {')
        ->toContain('export { Lingua }')
        // Verify PHP translations
        ->toContain('"uk":{"php":{"messages":{"hello":"\u041f\u0440\u0438\u0432\u0456\u0442 \u0421\u0432\u0456\u0442\u0435"}}')
        // Verify JSON translations
        ->toContain('"welcome":"\u041b\u0430\u0441\u043a\u0430\u0432\u043e \u043f\u0440\u043e\u0441\u0438\u043c\u043e"')
        ->toContain('"nested":{"key":"\u0412\u043a\u043b\u0430\u0434\u0435\u043d\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u043d\u044f"');
});
