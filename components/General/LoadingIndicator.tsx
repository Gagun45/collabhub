import { BeatLoader } from "react-spinners";

interface Props {
  className?: string;
}

const LoadingIndicator = ({ className }: Props) => {
  return <BeatLoader className={`${className} mx-auto`} />;
};
export default LoadingIndicator;
