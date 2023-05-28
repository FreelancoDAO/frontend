import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

const Packages = ({ register, control, setValue }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const data = useWatch({ control });
  console.log(data);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "plans",
  });

  const handleChange = (newValue) => {
    setSelectedTab(newValue);
  };

  const handlePriceChange = (index, event) => {
    const { value } = event.target;
    setValue(`plans[${index}].price`, value);
    fields[index].price = value;
  };

  const handleDescriptionChange = (index, event) => {
    const { value } = event.target;
    setValue(`plans[${index}].package_description`, value);
    fields[index].package_description = value;
  };

  return (
    <div>
      <div className="bg-gray-900 text-white rounded-lg shadow-md w-1/2 justify-between">
        <div className="flex justify-between w-full">
          <button
            className={`${
              selectedTab === 0 ? "bg-gray-400" : ""
            } text-gray-200 font-medium py-2 px-4 rounded-l-lg hover:bg-gray-900 focus:outline-none`}
            onClick={() => handleChange(0)}
            style={{
              borderBottom: selectedTab === 0 ? "2px solid blue" : "none",
            }}
          >
            Basic
          </button>
          <button
            className={`${
              selectedTab === 1 ? "bg-gray-400" : ""
            } text-gray-200 font-medium py-2 px-4 hover:bg-gray-900 focus:outline-none`}
            onClick={() => handleChange(1)}
            style={{
              borderBottom: selectedTab === 1 ? "2px solid blue" : "none",
            }}
          >
            Standard
          </button>
          <button
            className={`${
              selectedTab === 2 ? "bg-gray-400" : ""
            } text-gray-200 font-medium py-2 px-4 rounded-r-lg hover:bg-gray-900 focus:outline-none`}
            onClick={() => handleChange(2)}
            style={{
              borderBottom: selectedTab === 2 ? "2px solid blue" : "none",
            }}
          >
            Premium
          </button>
        </div>
      </div>
      {fields.map((plan, index) => (
        <div
          key={index}
          style={{ display: selectedTab === index ? "block" : "none" }}
        >
          <div className="flex-col items-start w-full justify-start text-start mt-2">
            <form className="w-full">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-gray-500"
              >
                Set Price
              </label>

              <div className="flex gap-x-2 items-center">
                <input
                  value={data.plans?.[index]?.price}
                  onChange={(e) => handlePriceChange(index, e)}
                  type="number"
                  className="mr-2 placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 h-12 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                />

                <span>$</span>
              </div>

              <label
                htmlFor="title"
                className="text-sm font-semibold text-gray-500"
              >
                Describe Your Package
              </label>
              <textarea
                value={data.plans?.[index]?.package_description}
                onChange={(e) => handleDescriptionChange(index, e)}
                multiline
                name="package_description"
                className="h-32 min-w-[calc(40vw)] placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              />
            </form>
          </div>

          {/* <TextField
            label="Set Price"
            variant="outlined"
            value={data.plans?.[index]?.price}
            onChange={(e) => handlePriceChange(index, e)}
            type="number"
          />
          <TextField
            label="Describe Your Package"
            variant="outlined"
            value={data.plans?.[index]?.package_description}
            onChange={(e) => handleDescriptionChange(index, e)}
            multiline
          /> */}
        </div>
      ))}
    </div>
  );
};

export default Packages;
