const getRandomColor = () => {
  const colors = [
    "bg-blue-100 dark:bg-blue-900/50",
    "bg-green-100 dark:bg-green-900/50",
    "bg-purple-100 dark:bg-purple-900/50",
    "bg-pink-100 dark:bg-pink-900/50",
    "bg-yellow-100 dark:bg-yellow-900/50",
    "bg-indigo-100 dark:bg-indigo-900/50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomIcon = () => {
  const icons = [
    "BookOpen",
    "BookMarked",
    "BookText",
    "BookType",
    "BookUser",
    "BookX",
    "Book",
    "BookmarkMinus",
    "BookmarkPlus",
    "Bookmark",
    "BookA",
    "BookCopy",
    "BookDashed",
    "BookHeadphones",
    "BookHeart",
    "Image",
    "ImageMinus",
    "ImagePlus",
    "ImageIcon",
    "Images",
    "FileText",
    "File",
    "FileArchive",
    "FileImage",
    "FileText",
    "Newspaper",
    "ScrollText",
    "StickyNote",
    "Type",
    "FileType2",
  ];
  return icons[Math.floor(Math.random() * icons.length)];
};

const PlaceholderImage = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  const IconComponent = (props: any) => {
    const DynamicIcon =
      require(`lucide-react`)[getRandomIcon()] || require(`lucide-react`).Image;
    return <DynamicIcon {...props} />;
  };

  return (
    <div
      className={`${className} ${getRandomColor()} flex items-center flex-col justify-center rounded-lg mb-8`}
    >
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <IconComponent className="h-24 w-24 text-foreground/50" />
    </div>
  );
};

export default PlaceholderImage;
