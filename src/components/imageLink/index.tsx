import { useEffect, useState } from "react";

interface ImageLinkProps {
    link: string
    defaultPath: string
    alt: string
}


const ImageLink:React.FC<ImageLinkProps> = ({ link, defaultPath, alt }: ImageLinkProps) => {
    const [imagePath, setImagePath] = useState<string>(link ? link : defaultPath);

    const handleImagePathError = () => setImagePath(defaultPath);
    const handleImagePath = (value: string) => setImagePath(value);

    useEffect(() => {
        handleImagePath(link);
    }, [link]);

    return (
        <img
            src={imagePath}
            alt={alt}
            onError={handleImagePathError}
        />
    )
}

export default ImageLink;
