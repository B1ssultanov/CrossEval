<?php

namespace app\Services\File\Create;

use App\Models\File;
use Illuminate\Support\Facades\File as FacadeFile;
use Illuminate\Http\UploadedFile;
use Exception;

class Service
{
    /**
     * File Model
     *
     * @var File
     */
    protected File $file;

    public function __construct()
    {
        $this->file = new File;
    }

    /**
     * File saving
     *
     * @param  UploadedFile $file
     * @param  string       $path
     * @param  string       $storage
     * @return File
     */
    public function execute(UploadedFile $file, string $path, string $storage = 'public'): File
    {
        $fileName = time() . '.' . $file->getClientOriginalExtension();
        $filePath = public_path($path) . $fileName;

        switch($storage) {
            case 'public':
                if (!FacadeFile::exists($filePath)) {
                    FacadeFile::makeDirectory(dirname($filePath), 0755, true, true);
                }
                $file->move(public_path($path), $fileName);
                break;
            default:
                throw new Exception('Хранилище указано не верно');
        }

        $path = $path . $fileName;

        return $this->file->create([
            'path'    => $path,
            'storage' => $storage,
        ]);
    }
}
