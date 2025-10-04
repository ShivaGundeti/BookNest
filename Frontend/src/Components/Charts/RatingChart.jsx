import React, { useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Theme } from "../../Context/ThemeContext/ThemeContext";

const RatingChart = ({ reviews }) => {
  const {SwitchTheme} = useContext(Theme)
  if (!reviews?.length) return null;

  // Prepare data for AreaChart
  const ratingData = [1, 2, 3, 4, 5].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.Rating === r).length,
  }));

  return (
    <div className={`w-full h-60 mb-6 p-4 rounded-lg shadow-md ${SwitchTheme === "dark" ? "text-white bg-gray-700": "text-black bg-white"}  `}>
      <h3 className="text-center font-semibold mb-2">
        Rating Distribution
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={ratingData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="rating" stroke="#666" />
          <YAxis stroke="#666" allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366F1"
            fillOpacity={1}
            fill="url(#colorRating)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingChart;
