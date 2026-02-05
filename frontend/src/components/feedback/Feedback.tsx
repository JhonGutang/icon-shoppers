import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/shared/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/shared/ui/card";


const Feedback = () => {
  return (
    <Card className="w-full text-left">
      <CardHeader className="flex flex-row items-center gap-3 capitalize">
        <Avatar>
          <AvatarImage src="https://i.pinimg.com/736x/f2/15/41/f21541d5d59eceb63be66d5f5eb6d42c.jpg" />
        </Avatar>
        <div>name</div>
      </CardHeader>
      <CardContent>
        <p className="text-wrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
          suscipit aliquid accusantium atque a neque magni amet commodi vel
          porro.
        </p>
      </CardContent>
    </Card>
  );
};

export default Feedback;
