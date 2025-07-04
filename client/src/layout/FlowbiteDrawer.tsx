import React from "react";
import { Drawer, DrawerHeader } from "flowbite-react";
import ProfilerMetricsTable from "./ProfilerTable";

type DrawerProps = {
  isOpen: boolean;
  onCloseFn: React.Dispatch<React.SetStateAction<boolean>>;
};

const FlowbiteDrawer = ({ isOpen, onCloseFn }: DrawerProps) => {
  const handleClose = () => {
    onCloseFn(false);
  };
  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      position="right"
      className="w-2xl !bg-gray-700"
      color="gray"
    >
      <DrawerHeader title="Metrics" />
      <ProfilerMetricsTable />
    </Drawer>
  );
};

export default FlowbiteDrawer;
