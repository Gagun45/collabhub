import type { MemberAvatarInterface } from "@/lib/types";
import MemberAvatar from "./MemberAvatar/MemberAvatar";

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
        <span
          className={
            "relative rounded-full flex items-center cursor-default justify-center size-10 border-2 border-background hover:z-10 bg-slate-400"
          }
        >
          +{totalAmount - amountToShow}
        </span>
      )}
    </div>
  );
};
export default MembersAvatars;
