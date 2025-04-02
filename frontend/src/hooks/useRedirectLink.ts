import { useRouter } from "next/navigation";

const useRedirectLink = () => {
  const router = useRouter();

  const toSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-") // Convert spaces to hyphens
      .replace(/[^\w-]/g, ""); // Remove special characters
  };

  const redirectLink = (name: string, id?: number) => {
    if (!name) return; // Prevent errors if name is empty
    const slug = toSlug(name);
    
    // If an ID is provided, include it in the URL
    const path = id ? `/${id}-${slug}` : `/${slug}`;
    
    router.push(path);
  };

  return { redirectLink };
};

export default useRedirectLink;
