"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Copy, SendHorizonal } from "lucide-react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";

export default function ShareModal({ url }: { url: string }) {
  const { toast } = useToast();

  const copyUrl = async () => {
    navigator.clipboard.writeText(url);

    toast({
      title: "Copiada",
      description: "¡URL copiada correctamente!",
      className: "bg-primary-500 text-white",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SendHorizonal
          strokeWidth={1.5}
          color="rgb(92 92 123)"
          size={22}
          className="cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir</DialogTitle>
          <DialogDescription>
            <span className="flex rounded-md border justify-between p-5 mt-5">
              <span className="overflow-hidden text-ellipsis w-[23rem]">
                <strong>{url}</strong>
              </span>

              <span title="Copiar">
                <Copy onClick={copyUrl} className="cursor-pointer" />
              </span>
            </span>
            <div className="flex items-center space-x-5 mt-5">
              <FacebookShareButton
                url={url}
                quote={"Twines Post"}
                hashtag={"#twines"}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <WhatsappShareButton url={url}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <EmailShareButton url={url}>
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
