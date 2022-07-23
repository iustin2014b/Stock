import React from "react";

export default function DropdownTime(props) {  
   return (
        <label id="labelTime">
        Time interval
            <select value={props.value} onChange={props.onChange}>
                <option value="hour">Hour</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>       
            </select>           
              ==========================================   Search Stock ===============================================================
        </label>
        
  );
};
