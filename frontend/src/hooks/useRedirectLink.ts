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
    
    // If it's a single segment and it's just "/", handle as home
    if (pathSegments.length === 1 && pathSegments[0] === "/") {
      router.push("/");
      return;
    }

    const processedSegments = pathSegments.map((segment) => {
      if (typeof segment === "string" && segment.startsWith("/")) {
        return toSlug(segment.substring(1));
      }
      return toSlug(segment);
    }).filter(s => s !== "");

    const path = `/${processedSegments.join("/")}`;
    router.push(path);
  };

  return { redirectLink };
};

export default useRedirectLink;
