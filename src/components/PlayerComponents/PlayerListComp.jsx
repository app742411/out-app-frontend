import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { PencilIcon, TrashBinIcon } from "../../icons";
import user1 from "../../../public/images/user/user-01.jpg";
import user2 from "../../../public/images/user/user-02.jpg";
import user3 from "../../../public/images/user/user-03.jpg";
import { useState, useMemo } from "react";
import { Link } from "react-router";




const playerData = [
  {
    id: 1,
    player: {
      image: user1,
      name: "Leo Fernandes",
      position: "Forward",
    },
    team: "U18 Elite Squad",
    matches: 22,
    goals: 15,
    registeredDate: "2023-01-15",
    status: "Active",
  },
  {
    id: 2,
    player: {
      image: user2,
      name: "Rohan Mehta",
      position: "Midfielder",
    },
    team: "Indore United",
    matches: 18,
    goals: 7,
    registeredDate: "2023-01-15",
    status: "Injured",
  },
  {
    id: 3,
    player: {
      image: user3,
      name: "Arjun Singh",
      position: "Goalkeeper",
    },
    team: "MP Juniors",
    matches: 25,
    goals: 0,
    registeredDate: "2023-01-15",
    status: "Active",
  },
];

export default function PlayerListComp() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  // Filter & sort players
  const filteredPlayers = useMemo(() => {
    let filtered = playerData.filter(
      (p) =>
        p.player.name.toLowerCase().includes(search.toLowerCase()) ||
        p.team.toLowerCase().includes(search.toLowerCase()) ||
        p.player.position.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === "name") return a.player.name.localeCompare(b.player.name);
        if (sortBy === "team") return a.team.localeCompare(b.team);
        if (sortBy === "matches") return b.matches - a.matches;
        if (sortBy === "goals") return b.goals - a.goals;
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return 0;
      });
    }

    return filtered;
  }, [search, sortBy]);

  // Edit/Delete handlers
  const handleEdit = (id) => {};
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Basic Tables" />
      {/* Search & Sort */}
      <div className="flex justify-end mb-4">
        <Link
          to="/add-player"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-primary/80 focus:outline-none focus:ring-4 focus:ring-primary/50 active:bg-primary/70" >
          + Add New Player
        </Link>
      </div>
      <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4  p-6">
          <input
            type="text"
            placeholder="Search by Name, Team or Position"
            className="border rounded-lg p-2 w-full md:w-1/2 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded-lg p-2 w-1/8 dark:bg-gray-800 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="team">Team</option>
            <option value="matches">Matches</option>
            <option value="goals">Goals</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3"
                  >
                    Player
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3"
                  >
                    Team
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3"
                  >
                    Matches
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3"
                  >
                    Goals
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3"
                  >
                    Register Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-right"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    {/* Player Info */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-100 dark:border-gray-800">
                          <img
                            width={40}
                            height={40}
                            src={player.player.image}
                            alt={player.player.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {player.player.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {player.player.position}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Team */}
                    <TableCell className="px-4 py-3">
                      {player.team}
                    </TableCell>

                    {/* Matches */}
                    <TableCell className="px-4 py-3">
                      {player.matches}
                    </TableCell>

                    {/* Goals */}
                    <TableCell className="px-4 py-3">
                      {player.goals}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {player.registeredDate}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          player.status === "Active"
                            ? "success"
                            : player.status === "Injured"
                              ? "warning"
                              : "error"
                        }
                      >
                        {player.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(player.id)}
                          className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-500/10 transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
