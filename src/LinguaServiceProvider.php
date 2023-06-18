<?php

namespace CyberWolfStudio\Lingua;

use Illuminate\Support\ServiceProvider;

final class LinguaServiceProvider extends Serviceprovider
{
    /**
     * Boot up our service provider.
     *
     * @return void
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                CommandTranslationGenerator::class,
            ]);
        }
    }
}
