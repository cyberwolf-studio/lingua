<?php

namespace CyberWolfStudio\Lingua;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use JsonException;

class TranslationPayload
{
    /**
     * Compile all the local translations.
     *
     * @param array $locales
     * @return Collection
     * @throws JsonException
     */
    public static function compile(array $locales = []): Collection
    {
        $payload = new static();

        $translations = [];

        foreach ($locales as $locale) { // supported locales
            $translations[$locale] = [
                'php' => $payload->phpTranslations($locale),
                'json' => $payload->jsonTranslations($locale),
            ];
        }

        return collect($translations);
    }

    /**
     * Compile the PHP file translations.
     *
     * @param string $locale
     * @return array
     */
    private function phpTranslations(string $locale): array
    {
        $path = lang_path($locale);

        return collect(File::allFiles($path))->mapWithKeys(function (\SplFileInfo $file) use ($locale) {
            $key = str($file->getPathname())
                ->replace([lang_path(), '.php'], '')
                ->replace(DIRECTORY_SEPARATOR.$locale.DIRECTORY_SEPARATOR, '')
                ->toString();
            $keyPath = explode(DIRECTORY_SEPARATOR, $key);
            $keyPath = array_reverse($keyPath);
            return [
                str($key)->replace(DIRECTORY_SEPARATOR, '.')->toString() => trans($key, [], $locale)
            ];
        })->undot()->toArray();
    }

    /**
     * Compile the JSON file translations.
     *
     * @param string $locale
     * @return array
     * @throws JsonException
     */
    private function jsonTranslations(string $locale): array
    {
        $path = lang_path("$locale.json");

        if (is_string($path) && is_readable($path)) {
            return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        }

        return [];
    }
}
