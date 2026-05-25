import React, { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import toast from "react-hot-toast";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PhoneInput from "../form/group-input/PhoneInput";
import MultiSelect from "../form/MultiSelect";
import { EnvelopeIcon } from "../../icons";

const AddPlayerForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    preferredFoot: "",
    positions: [],
    jerseyNumber: "",
    height: "",
    weight: "",
    team: "",
    isActive: true,

    // ⚽ Player qualities
    attributes: {
      pace: "",
      stamina: "",
      strength: "",
      agility: "",
    },
    skills: {
      passing: "",
      dribbling: "",
      shooting: "",
      defending: "",
      goalkeeping: "",
    },
    stats: {
      matchesPlayed: "",
      goals: "",
      assists: "",
      cleanSheets: "",
    },
    cards: {
      yellow: "",
      red: "",
    },

    // 👨‍👩‍👦 Guardian & contact
    parentOrGuardianName: "",
    contactPhone: "",
    address: "",
    medicalNotes: "",
  });

  // Options
  const preferredFootOptions = [
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "both", label: "Both" },
  ];

  const positionOptions = [
    { value: "GK", text: "Goalkeeper" },
    { value: "RB", text: "Right Back" },
    { value: "CB", text: "Center Back" },
    { value: "LB", text: "Left Back" },
    { value: "CDM", text: "Defensive Midfielder" },
    { value: "CM", text: "Central Midfielder" },
    { value: "CAM", text: "Attacking Midfielder" },
    { value: "RW", text: "Right Winger" },
    { value: "LW", text: "Left Winger" },
    { value: "ST", text: "Striker" },
  ];

  const countries = [
    { code: "IN", label: "+91" },
    { code: "GB", label: "+44" },
    { code: "US", label: "+1" },
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [name]: value },
    }));
  };

  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      stats: { ...prev.stats, [name]: value },
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      cards: { ...prev.cards, [name]: value },
    }));
  };

  const handlePreferredFootChange = (selected) => {
    setFormData((prev) => ({ ...prev, preferredFoot: selected?.value }));
  };

  const handlePositionsChange = (selectedValues) => {
    setFormData((prev) => ({ ...prev, positions: selectedValues }));
  };

  const handleDateChange = (dates, currentDateString) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: currentDateString }));
  };

  const handlePhoneNumberChange = (phoneNumber) => {
    setFormData((prev) => ({ ...prev, contactPhone: phoneNumber }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Player data saved successfully");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-5"
    >
      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Add Football Player
      </h4>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Enter detailed information to create a new player profile.
      </p>

      {/* Section 1: Personal Info */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-6">
        <div>
          <Label>First Name</Label>
          <Input name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <DatePicker
            id="dob"
            label="Date of Birth"
            placeholder="Select date"
            onChange={handleDateChange}
          />
        </div>
        <div>
          <Label>Height (cm)</Label>
          <Input name="height" type="number" value={formData.height} onChange={handleChange} />
        </div>
        <div>
          <Label>Weight (kg)</Label>
          <Input name="weight" type="number" value={formData.weight} onChange={handleChange} />
        </div>
      </div>

      {/* Section 2: Football Details */}
      <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">
        Player Information
      </h5>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <Label>Preferred Foot</Label>
          <Select
            options={preferredFootOptions}
            placeholder="Select foot"
            onChange={handlePreferredFootChange}
          />
        </div>
        <div>
          <Label>Jersey Number</Label>
          <Input
            name="jerseyNumber"
            type="number"
            value={formData.jerseyNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <MultiSelect
            label="Positions"
            options={positionOptions}
            onChange={handlePositionsChange}
          />
        </div>
        <div>
          <Label>Team</Label>
          <Input name="team" value={formData.team} onChange={handleChange} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
            className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Section 3: Attributes & Skills */}
      <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">
        Physical & Technical Attributes
      </h5>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
        {Object.keys(formData.attributes).map((attr) => (
          <div key={attr}>
            <Label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</Label>
            <Input
              name={attr}
              type="number"
              value={formData.attributes[attr]}
              onChange={handleAttributeChange}
              placeholder="0–100"
            />
          </div>
        ))}
        {Object.keys(formData.skills).map((skill) => (
          <div key={skill}>
            <Label>{skill.charAt(0).toUpperCase() + skill.slice(1)}</Label>
            <Input
              name={skill}
              type="number"
              value={formData.skills[skill]}
              onChange={handleSkillChange}
              placeholder="0–100"
            />
          </div>
        ))}
      </div>

      {/* Section 4: Stats & Cards */}
      <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">
        Match Stats & Discipline
      </h5>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
        {Object.keys(formData.stats).map((stat) => (
          <div key={stat}>
            <Label>{stat.charAt(0).toUpperCase() + stat.slice(1)}</Label>
            <Input
              name={stat}
              type="number"
              value={formData.stats[stat]}
              onChange={handleStatsChange}
            />
          </div>
        ))}
        {Object.keys(formData.cards).map((card) => (
          <div key={card}>
            <Label>{card.charAt(0).toUpperCase() + card.slice(1)} Cards</Label>
            <Input
              name={card}
              type="number"
              value={formData.cards[card]}
              onChange={handleCardChange}
            />
          </div>
        ))}
      </div>

      {/* Section 5: Contact & Medical Info */}
      <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">
        Guardian & Medical Info
      </h5>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <Label>Parent/Guardian Name</Label>
          <Input
            name="parentOrGuardianName"
            value={formData.parentOrGuardianName}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Contact Phone</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+91 (999) 999-9999"
            onChange={handlePhoneNumberChange}
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="lg:col-span-3">
          <Label>Medical Notes</Label>
          <textarea
            name="medicalNotes"
            value={formData.medicalNotes}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm text-gray-800 dark:border-gray-700 dark:text-gray-100"
            rows={3}
          ></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-6 lg:justify-end">
        <Button type="button" size="sm" variant="outline">
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save Player
        </Button>
      </div>
    </form>
  );
};

export default AddPlayerForm;
