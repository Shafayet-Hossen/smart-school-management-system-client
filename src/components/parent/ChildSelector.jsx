
import { Users } from "lucide-react";

const ChildSelector = ({
  children = [],
  selectedChild = "all",
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full sm:max-w-sm">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Users size={16} />
        Select Child
      </label>

      <select
        className="select select-bordered w-full"
        value={selectedChild}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="all">All Children</option>

        {children.map((child) => (
          <option
            key={child._id}
            value={child._id}
          >
            {child.first_name} {child.last_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChildSelector;
