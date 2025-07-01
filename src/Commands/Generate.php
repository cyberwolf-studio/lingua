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
    protected $signature = 'lingua:generate {--path=resources/js/translations/lingua_locales} {--manifestPath=resources/js/lingua-manifest.js}';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Generate individual translation locale JSON files (for Vite dynamic import) and a manifest file.';

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
        // Calculate the relative path from the manifest file's directory to the translations output directory.
        $manifestDir = dirname($manifestPath);
        // Ensure outputBasePath is an absolute path or resolvable relative to CWD for getRelativePath
        $outputBasePathAbs = $this->files->exists($outputBasePath) ? realpath($outputBasePath) : $outputBasePath;
        if (!$this->files->isAbsolutePath($outputBasePathAbs)) {
             $outputBasePathAbs = getcwd() . DIRECTORY_SEPARATOR . $outputBasePathAbs;
        }
        $outputBasePathAbs = rtrim(str_replace('/', DIRECTORY_SEPARATOR, $outputBasePathAbs), DIRECTORY_SEPARATOR);


        $relativePath = $this->getRelativePath($manifestDir, $outputBasePathAbs);

        // Ensure it's a POSIX-style relative path, suitable for JS imports.
        $translationsImportPrefix = rtrim(str_replace(DIRECTORY_SEPARATOR, '/', $relativePath), '/') . '/';
        // If the manifest is in the same directory or a parent of outputBasePath, prefix with './'
        if (!preg_match('/^(\.\.\/|\.\/)/', $translationsImportPrefix)) {
            $translationsImportPrefix = './' . $translationsImportPrefix;
        }


        $manifestContent = <<<EOT
const LinguaManifest = {
    availableLocales: Object.freeze(JSON.parse('{$this->jsonEncode($availableLocales)}')),
    translationsImportPrefix: '{$translationsImportPrefix}' // Changed from translationsBasePath
};

export { LinguaManifest };
EOT;

        $this->files->put($manifestPath, $manifestContent);
        $this->info("Generated manifest file at {$manifestPath} with importPrefix: {$translationsImportPrefix}");
    }

    /**
     * Calculate the relative path from one directory to another.
     *
     * @param string $from
     * @param string $to
     * @return string
     */
    private function getRelativePath(string $from, string $to): string
    {
        // Normalize directory separators and remove trailing slash for realpath
        $from = rtrim(str_replace('/', DIRECTORY_SEPARATOR, $from), DIRECTORY_SEPARATOR);
        $to = rtrim(str_replace('/', DIRECTORY_SEPARATOR, $to), DIRECTORY_SEPARATOR);

        // Get real paths
        $from = realpath($from) ?: $from;
        $to = realpath($to) ?: $to;

        $fromParts = explode(DIRECTORY_SEPARATOR, $from);
        $toParts = explode(DIRECTORY_SEPARATOR, $to);

        $commonParts = [];
        foreach ($fromParts as $i => $part) {
            if (isset($toParts[$i]) && $fromParts[$i] === $toParts[$i]) {
                $commonParts[] = $part;
            } else {
                break;
            }
        }

        $upwards = count($fromParts) - count($commonParts);
        $downwards = array_slice($toParts, count($commonParts));

        $relativePath = str_repeat('..' . DIRECTORY_SEPARATOR, $upwards) . implode(DIRECTORY_SEPARATOR, $downwards);

        return $relativePath === '' ? '.' : $relativePath; // Stay in same dir if paths are identical after normalization
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
