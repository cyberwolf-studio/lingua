<?php

namespace CyberWolfStudio\Lingua;

use CyberWolfStudio\Lingua\Commands\Generate;
use CyberWolfStudio\Lingua\Commands\Install;
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
                Generate::class,
                Install::class,
            ]);
        }
    }
}
