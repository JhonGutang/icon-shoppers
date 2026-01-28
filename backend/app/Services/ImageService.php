<?php

namespace App\Services;

use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\ImageServiceInterface;
use Illuminate\Support\Facades\Storage;

class ImageService implements ImageServiceInterface
{
    /**
     * Upload an image.
     *
     * @param mixed $image
     * @param string|null $directory
     * @return string The path or URL of the uploaded image
     */

    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function uploadImage($image, ?string $directory = null, ?string $shopSlug = null): string
    {
        // Build directory path with shop slug if provided
        if ($shopSlug) {
            $directory = $shopSlug . '/' . ($directory ?? 'products');
        }
        
        $imagePath = $image->store($directory, 'public');
        return $imagePath;
    }

    public function deleteImageIfExists($image, $id = null)
    {
        if($id === null) {
            Storage::disk('public')->delete($image);
        }
        
        if($image && $id) {
            $shop = $this->userRepository->getUser($id);
            Storage::disk('public')->delete($shop->logo_image);
        }
    }
}
