<?php

use CyberWolfStudio\Lingua\TranslationPayload;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    // Create test JSON locale file
    $jsonContent = json_encode([
        'welcome' => 'Welcome',
        'hello' => 'Hello',
        'nested' => [
            'key' => 'Nested value'
        ]
    ]);
    
    File::put(lang_path('en.json'), $jsonContent);
});

afterEach(function () {
    // Clean up test files
    File::delete(lang_path('en.json'));
});

test('it can compile json locale file', function () {
    $translations = TranslationPayload::compile(['en']);

    expect($translations)
        ->toHaveKey('en')
        ->and($translations['en'])
        ->toHaveKey('json')
        ->toHaveKey('php');

    // Check JSON translations
    $jsonTranslations = $translations['en']['json'];
    
    expect($jsonTranslations)
        ->toHaveKey('welcome', 'Welcome')
        ->toHaveKey('hello', 'Hello')
        ->toHaveKey('nested.key', 'Nested value');

    // PHP translations should be empty since we only created a JSON file
    expect($translations['en']['php'])->toBeEmpty();
}); 