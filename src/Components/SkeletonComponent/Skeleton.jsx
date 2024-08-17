import React from "react";

const _squareSkeleton = (props) => {
  return (
    <div className={`h-10 bg-slate-200 ${props.className} rounded-md`}></div>
  );
};

const Skeleton = (props) => {
  return (
    <div className="animate-pulse min-h-full">{_squareSkeleton(props)}</div>
  );
};

export default Skeleton;
