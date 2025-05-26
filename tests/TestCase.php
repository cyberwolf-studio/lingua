<?php

namespace Tests;

use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app)
    {
        return [
            \CyberWolfStudio\Lingua\LinguaServiceProvider::class,
        ];
    }
} 