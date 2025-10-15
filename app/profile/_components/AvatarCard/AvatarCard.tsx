import { Card, CardContent } from "@/components/ui/card";
import type { UserType } from "@/lib/types";
import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateAvatarUrlMutation } from "@/redux/apis/profile.api";
import { Upload, XIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  user: UserType;
}

const AvatarCard = ({ user }: Props) => {
  const avatar = user.UserInformation?.avatarUrl ?? user.image ?? DefaultAvatar;
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [tempUrl, setTempUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveAvatar] = useUpdateAvatarUrlMutation();
  const handleClick = () => {
    imageInputRef.current?.click();
  };
  const handleRemove = () => {
    setTempUrl(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setTempUrl(null);
      console.log("No file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      console.log(data);
      if (data.secure_url) {
        setTempUrl(data.secure_url);
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const userPid = user.UserInformation?.userPid;
    const url = tempUrl;
    if (!userPid || !url) return;
    setSaving(true);
    await saveAvatar({
      url,
      userPid,
    });
    setSaving(false);
    setTempUrl(null);
  };
  return (
    <Card className="w-full max-w-2xl lg:w-72 shrink-0">
      <CardContent className="space-y-4">
        <div className="relative size-48 mx-auto rounded-full overflow-hidden border border-border">
          <Image
            priority
            src={tempUrl || avatar}
            alt="Profile avatar"
            sizes="(max-width: 640px) 144px, 192px"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <input
            ref={imageInputRef}
            id="avatar-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <label htmlFor="avatar-file">
            <Button variant="outline" onClick={handleClick}>
              <Upload />
              {uploading && <span>Uploading...</span>}
            </Button>
          </label>

          {tempUrl && !uploading && (
            <>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Confirm"}
              </Button>
              <Button
                variant={"destructive"}
                onClick={handleRemove}
                disabled={saving}
              >
                <XIcon />
              </Button>
            </>
          )}
        </div>
        <h2 className="text-center break-words">{user.email}</h2>
      </CardContent>
    </Card>
  );
};
export default AvatarCard;
