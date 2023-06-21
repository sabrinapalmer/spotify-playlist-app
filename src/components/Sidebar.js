import React from "react";
import { Icon, Slider, Select, MenuItem } from "@material-ui/core";

function Sidebar(props) {
  const {
    settings,
    selectedSettings,
    handleSettingChange,
    handleSettingSelection,
    handleAddSetting,
    handleClearSettings,
    seedOptions,
    seedType,
    selectedSeed,
    handleSeedTypeChange,
    handleSeedSelection,
    handleSubmit,
  } = props;

  return (
    <div style={{ width: "40%", padding: "0 20px", overflow: "hidden" }}>
      <h2>Settings:</h2>
      <div style={{ display: "flex", paddingBottom: "40px" }}>
        <Select
          value={seedType}
          onChange={handleSeedTypeChange}
          style={{ marginRight: "10px", width: "50%" }}
        >
          <MenuItem value="Genre">Genre</MenuItem>
          <MenuItem value="Artist">Artist</MenuItem>
          <MenuItem value="Track">Track</MenuItem>
        </Select>
        {seedType !== "" && (
          <Select
            value={selectedSeed}
            onChange={handleSeedSelection}
            style={{ marginRight: "10px", width: "50%" }}
          >
            {seedOptions.map((seed, index) => (
              <MenuItem key={index} value={seed.id}>
                {seed.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>
      {selectedSettings.map((setting, index) => (
        <div
          key={setting.variableName}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Select
            value={setting.variableName}
            onChange={(e) => handleSettingSelection(index, e.target.value)}
            style={{ marginRight: "10px", width: "50%" }}
          >
            {settings.map((s, i) => (
              <MenuItem key={i} value={s.variableName}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
          <div style={{ width: "100%" }}>
            <label style={{ marginRight: "10px" }}>Range:</label>
            <Slider
              min={
                settings.find((s) => s.variableName === setting.variableName)
                  ?.min || 0
              }
              max={
                settings.find((s) => s.variableName === setting.variableName)
                  ?.max || 1
              }
              step={
                settings.find((s) => s.variableName === setting.variableName)
                  ?.max / 100 || 0.1
              }
              value={[setting.min, setting.max]}
              onChange={(_, newValue) =>
                handleSettingChange(index, newValue[0], newValue[1])
              }
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      ))}
      {settings.length > selectedSettings.length && (
        <button onClick={handleAddSetting}>Add Setting</button>
      )}
      {selectedSettings.length ? (
        <button onClick={handleClearSettings}>Clear Settings</button>
      ) : (
        ""
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      ></div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Sidebar;
