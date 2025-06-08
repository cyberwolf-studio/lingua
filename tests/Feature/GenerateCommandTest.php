<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

uses(Tests\TestCase::class);

it('lingua:generate command creates translation file', function () {
    // Define a temporary path for the output file
    $outputPath = storage_path('lingua_test_' . Str::random(10) . '.js');

    // Ensure the directory for the output path exists
    File::makeDirectory(dirname($outputPath), 0777, true, true);

    // Create a dummy language file
    $langPath = lang_path('uk/messages.php');
    File::makeDirectory(dirname($langPath), 0777, true, true);
    File::put($langPath, "<?php\n\nreturn ['hello' => 'Привіт Світе'];");

    // Run the artisan command
    $this->artisan('lingua:generate', ['path' => $outputPath])
        ->assertExitCode(0);

    // Assert that the output file was created
    $this->assertFileExists($outputPath);

    // Read the generated file content
    $content = File::get($outputPath);

    // Define the expected JSON string structure for the translations
    $expectedJsonSubstring = '"uk":{"php":{"messages":{"hello":"\u041f\u0440\u0438\u0432\u0456\u0442 \u0421\u0432\u0456\u0442\u0435"}}'; // Start of the expected structure
    // Note: We are not asserting the full JSON content including default validation messages
    // as they might change. We focus on our added translation and the structure.

    // Assert that the content is a valid JS file with the expected structure and translation
    $this->assertStringContainsString('const Lingua = { translations: {', $content);
    $this->assertStringContainsString($expectedJsonSubstring, $content);
    $this->assertStringContainsString('"hello":"\u041f\u0440\u0438\u0432\u0456\u0442 \u0421\u0432\u0456\u0442\u0435"', $content);
    $this->assertStringContainsString('export { Lingua }', $content);

    // Clean up the dummy language file and the generated file
    File::delete($langPath);
    File::delete($outputPath);
});
