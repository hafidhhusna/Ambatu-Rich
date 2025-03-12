interface NavbarProps {
  menu: string;
  path: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

export type {
  NavbarProps,
  FeatureCardProps
};