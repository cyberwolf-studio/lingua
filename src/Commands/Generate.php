<?php

namespace CyberWolfStudio\Lingua\Commands;

use CyberWolfStudio\Lingua\TranslationPayload;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;
use JsonException;

final class Generate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lingua:generate {--path=public/translations} {--manifestPath=resources/js/lingua-manifest.js}';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Generate individual translation locale JSON files and a manifest file.';

    /**
     * Filesystem instance for moving files.
     *
     * @var Filesystem
     */
    protected Filesystem $files;

    /**
     * Create a new console command instance.
     *
     * @return void
     */
    public function __construct(Filesystem $files)
    {
        parent::__construct();

        $this->files = $files;
    }

    /**
     * Process the command.
     *
     * @return void
     * @throws JsonException
     */
    public function handle(): void
    {
        $outputBasePath = $this->option('path');
        $manifestPath = $this->option('manifestPath');

        $this->makeDirectory($outputBasePath);
        $this->makeDirectory(dirname($manifestPath));

        $availableLocales = $this->getAvailableLocales();

        if (empty($availableLocales)) {
            $this->warn('No language files found. Looked in ' . lang_path());
            return;
        }

        foreach ($availableLocales as $locale) {
            // Call the new method directly to get translations for the specific locale
            $localeTranslations = TranslationPayload::getTranslationsForLocale($locale);

            // Check if $localeTranslations is empty (e.g. no php or json files for that locale)
            if (empty($localeTranslations['php']) && empty($localeTranslations['json'])) {
                $this->warn("No translations found for locale: {$locale}");
                continue;
            }

            $filePath = rtrim($outputBasePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $locale . '.json';
            $this->files->put($filePath, json_encode($localeTranslations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
            $this->info("Generated translations for locale: {$locale} at {$filePath}");
        }

        $this->generateManifestFile($manifestPath, $availableLocales, $outputBasePath);

        $this->info('Lingua translation files and manifest generated successfully.');
    }

    /**
     * Get all available locales based on directories and .json files in lang_path().
     *
     * @return array
     */
    private function getAvailableLocales(): array
    {
        $locales = [];
        $langPath = lang_path();

        // Get locales from directories like /lang/en, /lang/es
        $directories = File::directories($langPath);
        foreach ($directories as $dir) {
            $locales[] = File::basename($dir);
        }

        // Get locales from files like /lang/en.json, /lang/es.json
        $jsonFiles = File::files($langPath);
        foreach ($jsonFiles as $file) {
            if (strtolower($file->getExtension()) === 'json') {
                $locales[] = $file->getFilenameWithoutExtension();
            }
        }

        return array_values(array_unique($locales));
    }

    /**
     * Generate the manifest JS file.
     *
     * @param string $manifestPath
     * @param array $availableLocales
     * @param string $outputBasePath
     * @return void
     */
    private function generateManifestFile(string $manifestPath, array $availableLocales, string $outputBasePath): void
    {
        // Assuming $outputBasePath is relative to the project's public directory.
        // We need to make it a web-accessible path.
        $publicPath = public_path();
        $translationsBasePath = str_replace($publicPath, '', $outputBasePath);
        $translationsBasePath = '/' . ltrim(str_replace(DIRECTORY_SEPARATOR, '/', $translationsBasePath), '/');
        if (substr($translationsBasePath, -1) !== '/') {
            $translationsBasePath .= '/';
        }


        $manifestContent = <<<EOT
const LinguaManifest = {
    availableLocales: Object.freeze(JSON.parse('{$this->jsonEncode($availableLocales)}')),
    translationsBasePath: '{$translationsBasePath}'
};

export { LinguaManifest };
EOT;

        $this->files->put($manifestPath, $manifestContent);
        $this->info("Generated manifest file at {$manifestPath}");
    }

    /**
     * Helper to JSON encode data for embedding in JS.
     *
     * @param mixed $data
     * @return string
     */
    private function jsonEncode($data): string
    {
        return json_encode($data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Make the directory if it doesn't exist.
     *
     * @param string $path
     * @return void
     */
    private function makeDirectory(string $path): void
    {
        if (!$this->files->isDirectory(dirname($path))) {
            $this->files->makeDirectory(dirname($path), 0777, true, true);
        }
    }
}
