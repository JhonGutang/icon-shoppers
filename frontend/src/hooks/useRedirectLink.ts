import { useRouter } from "next/navigation";

const useRedirectLink = () => {
  const router = useRouter();

  const toSlug = (name: string | number) => {
    if (typeof name === "number") return name.toString(); // Keep numbers unchanged
    return name
      .toLowerCase()
      .replace(/\s+/g, "-") // Convert spaces to hyphens
      .replace(/[^\w-]/g, ""); // Remove special characters
  };

  const redirectLink = (...pathSegments: (string | number)[]) => {
    if (!pathSegments.length) return; // Prevent errors if no path is provided

    // Process each segment: slugify strings, keep numbers unchanged
    const processedSegments = pathSegments.map((segment) => toSlug(segment));

    // Join segments into a valid URL path
    const path = `/${processedSegments.join("/")}`;

    router.push(path);
  };

  return { redirectLink };
};

export default useRedirectLink;
