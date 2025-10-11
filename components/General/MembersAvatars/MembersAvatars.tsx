import type { MemberAvatarInterface } from "@/lib/types";
import MemberAvatar from "./MemberAvatar/MemberAvatar";
import { Button } from "@/components/ui/button";

interface Props {
  memberAvatars: MemberAvatarInterface[];
  amountToShow: number;
}

const MembersAvatars = ({ memberAvatars, amountToShow }: Props) => {
  const totalAmount = memberAvatars.length;
  return (
    <div className="flex items-center -space-x-2">
      {memberAvatars.slice(0, amountToShow).map((ma) => (
        <MemberAvatar
          key={ma.userPid}
          avatarUrl={ma.avatarUrl}
          username={ma.username}
        />
      ))}
      {totalAmount > amountToShow && (
        <Button
          variant="foreground"
          mode="icon"
          shape="circle"
          className="relative size-10 border-2 border-background hover:z-10 bg-slate-400"
        >
          +{totalAmount - amountToShow}
        </Button>
      )}
    </div>
  );
};
export default MembersAvatars;
