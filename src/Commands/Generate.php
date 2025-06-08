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
    protected $signature = 'lingua:generate {path=./resources/js/lingua.js}';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Generate translation js file for including in build process';

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
        $path = $this->argument('path');

        $translations = $this->generate();

        $this->makeDirectory($path);

        $this->files->put($path, $translations);

        $this->info('Translations file generated.');
    }

    /**
     * Generate the translations for the file.
     *
     * @return string
     * @throws JsonException
     */
    public function generate(): string
    {
        $locales = [];

        $directories = File::directories(lang_path());
        $files = File::files(lang_path());

        $paths = array_merge($directories, $files);

        foreach ($paths as $path) {
            $path = str_replace([lang_path() . DIRECTORY_SEPARATOR, '.json'], '', $path);
            $locales[] = $path;
        }

        $json = TranslationPayload::compile(array_unique($locales))->toJson();

        return <<<EOT
const Lingua = { translations: $json }

export { Lingua }

EOT;
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
