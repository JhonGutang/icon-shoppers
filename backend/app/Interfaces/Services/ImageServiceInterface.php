<?php

namespace App\Interfaces\Services;

interface ImageServiceInterface
{
    /**
     * Upload an image.
     *
     * @param  mixed  $image
     * @return string The path or URL of the uploaded image
     */
    public function uploadImage($image, ?string $directory = null, ?string $shopSlug = null): string;

    public function deleteImageIfExists($image, ?int $id = null);
}
