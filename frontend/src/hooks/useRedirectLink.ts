import { useRouter } from "next/navigation";

const useRedirectLink = () => {
  const router = useRouter();

  const redirectLink = (link: string) => {
    router.push(`/${link}`);
  };

  return {redirectLink}
};

export default useRedirectLink;
