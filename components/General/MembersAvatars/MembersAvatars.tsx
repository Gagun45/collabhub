import type { MemberAvatarInterface } from "@/lib/types";
import MemberAvatar from "./MemberAvatar/MemberAvatar";



interface Props {
  memberAvatars: MemberAvatarInterface[];
  amountToShow: number;
}

const MembersAvatars = ({ memberAvatars, amountToShow }: Props) => {
  const totalAmount = memberAvatars.length;
  return (
    <div className="flex items-center">
      <div className="flex items-center -space-x-3">
        {memberAvatars.slice(0, amountToShow).map((ma) => (
          <MemberAvatar
            key={ma.userPid}
            avatarUrl={ma.avatarUrl}
            username={ma.username}
          />
        ))}
      </div>
      {totalAmount > amountToShow && (
        <span className="">+{totalAmount - amountToShow}</span>
      )}
    </div>
  );
};
export default MembersAvatars;
