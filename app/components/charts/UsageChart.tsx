"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Bill = {
  month: number;
  year: number;
  unitsConsumed: number;
  amount: number;
};

type Props = {
  bills: Bill[];
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function UsageChart({
  bills,
}: Props) {
  const chartData =
    [...bills]
      .sort((a, b) => {
        const dateA =
          new Date(
            a.year,
            a.month - 1
          ).getTime();

        const dateB =
          new Date(
            b.year,
            b.month - 1
          ).getTime();

        return (
          dateA - dateB
        );
      })
      .map((bill) => ({
        label:
          monthNames[
            bill.month - 1
          ],

        fullLabel: `${monthNames[bill.month - 1]} ${bill.year}`,

        usage:
          bill.unitsConsumed,

        amount:
          bill.amount,
      }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="usage"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#3b82f6"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#3b82f6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{
              fill:
                "#a1a1aa",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill:
                "#a1a1aa",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
            width={40}
          />

          <Tooltip
            cursor={{
              stroke:
                "rgba(255,255,255,0.18)",
              strokeWidth: 1,
            }}
            contentStyle={{
              background:
                "#18181b",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius:
                "14px",
              color: "white",
              padding:
                "10px 14px",
            }}
            formatter={(
              value: number
            ) => [
              `${value} kWh`,
              "Usage",
            ]}
            labelFormatter={(
              label,
              payload
            ) =>
              payload?.[0]
                ?.payload
                ?.fullLabel ||
              label
            }
          />

          <Area
            type="monotone"
            dataKey="usage"
            stroke="#60a5fa"
            strokeWidth={2.5}
            fill="url(#usage)"
            activeDot={{
              r: 5,
              stroke:
                "#ffffff",
              strokeWidth: 2,
              fill: "#60a5fa",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}