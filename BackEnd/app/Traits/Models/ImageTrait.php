<?php

namespace App\Traits\Models;

use Illuminate\Http\UploadedFile;

trait ImageTrait
{
    /**
     * Сохрание фотографии
     *
     * @param  Illuminate\Http\UploadedFile $image
     * @return $this
     */
    public function saveImage(UploadedFile $image): self
    {
        if ($this->image !== null) {
            // на всякий удаляем фотографию
            $this->deleteImage();
        }

        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/' . $this->imageDirectory), $imageName );

        $this->image = 'images/' . $this->imageDirectory . '/' . $imageName;

        return $this;
    }

    /**
     * Удаление записи из бд. Добавил удаление фотографии
     *
     * @return bool
     */
    public function deleteImage(): bool
    {
        $path = public_path($this->image);

        if (!file_exists($path)) {
            return false;
        }

        //удаление фото
        return unlink($path);
    }

    /**
     * Замена фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\SearchCategory
     */
    public function updateImage(UploadedFile $image): self
    {
        $oldImagePath = public_path($this->image);
        if (file_exists($oldImagePath)) {
            //удаление фото
            unlink($oldImagePath);
        }

        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/' . $this->imageDirectory), $imageName );

        $this->image = 'images/' . $this->imageDirectory . '/' . $imageName;

        return $this;
    }
}
