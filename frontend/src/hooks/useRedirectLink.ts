import { useRouter } from "next/navigation";

const useRedirectLink = () => {
  const router = useRouter();

  const toSlug = (name: string | number) => {
    if (typeof name === "number") return name.toString(); 
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, ""); 
  };

  const redirectLink = (...pathSegments: (string | number)[]) => {
    if (!pathSegments.length) return;
    
    const processedSegments = pathSegments.map((segment) => toSlug(segment));
    const path = `/${processedSegments.join("/")}`;
    router.push(path);
  };

  return { redirectLink };
};

export default useRedirectLink;
