import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  avatarUrl: string;
  username: string;
}

const MemberAvatar = ({ avatarUrl, username }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar>
            <AvatarImage
              src={avatarUrl}
              alt="Profile avatar"
              className="border-2 border-background hover:z-10"
            />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{username}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default MemberAvatar;
