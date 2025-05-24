<?php

namespace CyberWolfStudio\Lingua\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

final class Install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lingua:install';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Install Lingua frontend package for Laravel (Vue, React, or Svelte)';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle(): void
    {
        $frameworks = [
            'vue' => '@cyberwolf.studio/lingua-vue',
            'react' => '@cyberwolf.studio/lingua-react',
            'svelte' => '@cyberwolf.studio/lingua-svelte',
        ];

        $choice = $this->choice(
            'Which frontend framework do you use?',
            array_keys($frameworks),
            0
        );

        $package = $frameworks[$choice];
        $manager = $this->detectPackageManager();

        if (!$manager) {
            $this->error('No supported Node.js package manager (npm, yarn, pnpm) found.');
            return;
        }

        $installCmd = match ($manager) {
            'yarn' => ['yarn', 'add', $package],
            'pnpm' => ['pnpm', 'add', $package],
            default => ['npm', 'install', $package],
        };

        $this->info("Installing $package using $manager...");
        $process = new Process($installCmd);
        $process->setTty(Process::isTtySupported());
        $process->run(function ($type, $buffer) {
            echo $buffer;
        });

        if ($process->isSuccessful()) {
            $this->info("$package installed successfully!");
        } else {
            $this->error("Failed to install $package. Please run the following command manually:");
            $this->line(implode(' ', $installCmd));
        }
    }

    /**
     * Detect the user's Node.js package manager.
     *
     * @return string|null
     */
    protected function detectPackageManager(): ?string
    {
        $managers = ['yarn', 'pnpm', 'npm'];
        foreach ($managers as $manager) {
            if ($this->commandExists($manager)) {
                return $manager;
            }
        }
        return null;
    }

    /**
     * Check if a command exists on the system.
     *
     * @param string $command
     * @return bool
     */
    protected function commandExists(string $command): bool
    {
        $process = new Process([
            PHP_OS_FAMILY === 'Windows' ? 'where' : 'command',
            PHP_OS_FAMILY === 'Windows' ? $command : '-v',
            PHP_OS_FAMILY === 'Windows' ? '' : $command,
        ]);
        $process->run();
        return $process->isSuccessful();
    }
}
