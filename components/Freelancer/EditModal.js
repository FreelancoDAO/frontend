import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { updateUserProfile } from "../../api/profile";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";

const EditModal = ({
  editFieldName,
  setShowModal,
  freelancerUser,
  setFreelancerUser,
}) => {
  const [name, setName] = useState("");
  const [degree, setDegree] = useState(["B.tech", "BSC", "BCA", "Bcom", "BA"]);
  const [experience, setExperince] = useState({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
  });
  const [education, setEducation] = useState({
    degree: "",
    collegeName: "",
    startDate: "",
    endDate: "",
  });
  const [projects, setprojects] = useState({
    title: "",
    description: "",
    githubURL: "",
    liveURL: "",
    startDate: "",
    endDate: "",
  });
  const [description, setDescription] = useState(null);
  const { user, skills, currentFreelancerData, setCurrentFreelancerData } =
    useAuth();
  const [skill, setSkill] = useState([]);
  useEffect(() => {
    setEducation((prevData) => ({ ...prevData, ["degree"]: degree[0] }))
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  // const getProfile = async (id) => {
  //   const data = await freelancerProfile(id)
  //   console.log("data----------->", data);

  // }

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };
  const skillOptions = [
    { value: "ReactJs", label: "ReactJs" },
    { value: "AngularJs", label: "AngularJs" },
    { value: "React Native", label: "React native" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Mongo", label: "Mongo" },
  ];
  function handleChange(selected) {
    console.log(selected);
    return setSkill(selected);
  }

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperince((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducation((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setprojects({ ...projects, [name]: value });
  };

  const updateProfile = async () => {
    let payload;
    if (name) {
      payload = { name: name };
    } else if (skill.length > 0) {
      const skill_data = skill.map((s) => s.value);
      payload = { skill: skill_data };
    } else if (description) {
      payload = { description };
    } else if (experience.role && experience.company) {
      payload = {
        workExperience: [...currentFreelancerData?.workExperience, experience],
      };
    } else if (education.degree && education.collegeName) {
      payload = {
        education: [...currentFreelancerData?.education, education],
      };
    } else if (projects.title && projects.description) {
      payload = {
        projects: [...currentFreelancerData?.projects, projects],
      };
    }
    const data = await updateUserProfile(currentFreelancerData._id, payload);

    console.log("data-------------------->", data);
    setCurrentFreelancerData(data.user);
    setShowModal(false);
  };

  return (
    <div tabindex="-1" class="absoluteCenter bg-gray-900 opacity-80 z-50">
      <div class="relative">
        <div class="relative rounded-lg shadow border-blue-100 border-2 px-10 py-20">
          {editFieldName == "name" && (
            <form>
              <label className="block mb-2 text-sm font-medium text-white">
                Your Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black text-white text-m rounded-lg w-full p-2.5 border-blue-100 border-2"
              />
              <p
                id="helper-text-explanation"
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                We'll never share your details. Read our{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
          {editFieldName == "skill" && (
            <>
              <h1 className="self-start text-2xl font-extrabold pl-1 my-5">
                Add Skills
              </h1>

              <ReactSelect
                options={skillOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option,
                }}
                onChange={handleChange}
                allowSelectAll={true}
                value={skill.optionSelected}
                className="block w-full bg-gray-200 text-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </>
          )}

          {editFieldName == "description" && (
            <>
              <label
                htmlFor="description"
                className="font-bold text-xl mb-4 mt-4"
              >
                Pitch yourself
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                className="mr-2 w-11/12 h-32 placeholder:italic placeholder:text-slate-400 block bg-gray-100 bg-opacity-5 my-2 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              />
              <p
                id="helper-text-explanation"
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                We'll never share your details. Read our{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </>
          )}

          {editFieldName === "experience" && (
            <>
              <h1 className="self-start text-2xl font-extrabold pl-1 my-5">
                Add Experience
              </h1>
              <label className="block mb-2 text-sm font-medium text-white">
                Role
              </label>
              <input
                required
                className="bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
                name="role"
                value={experience.role}
                onChange={handleExperienceChange}
              />
              <label className="block mb-2 text-sm font-medium text-white">
                Company
              </label>
              <input
                required
                className="bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
                name="company"
                value={experience.company}
                onChange={handleExperienceChange}
              />
              <label className="block mb-2 text-sm font-medium text-white">
                Start date
              </label>
              <div className="flex justify-between w-full items-center">
                <div>
                  <input
                    className="text-black"
                    required
                    type="date"
                    name="startDate"
                    value={experience.startDate}
                    onChange={handleExperienceChange}
                  />
                </div>
              </div>
              <label className="block mb-2 text-sm font-medium text-white">
                End date
              </label>
              <div className="flex justify-between w-full items-center">
                <div>
                  <input
                    required
                    className="text-black"
                    type="date"
                    name="endDate"
                    value={experience.endDate}
                    onChange={handleExperienceChange}
                  />
                </div>
              </div>
            </>
          )}
          {editFieldName === "education" && (
            <>
              <h1 className="self-start text-2xl font-extrabold pl-1 my-5">
                Add Education
              </h1>
              <label
                htmlFor="degree"
                className="text-sm font-semibold text-gray-500"
              >
                Degree
              </label>
              <select
                name="degree"
                className="bg-black my-2 py-2 border-transparent rounded-lg px-2 font-light w-full focus:border-transparent active:border-transparent focus-visible:border-transparent"
                value={education.degree}
                onChange={handleEducationChange}
              >
                {degree?.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <label className="block mb-2 text-sm font-medium text-white">
                College Name
              </label>
              <input
                className=" bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
                name="collegeName"
                value={education.collegeName}
                onChange={handleEducationChange}
              />
              <label className="block mb-2 text-sm font-medium text-white">
                Start date
              </label>
              <div className="flex justify-between w-full items-center">
                <div>
                  <input
                    className="text-black"
                    type="date"
                    name="startDate"
                    value={education.startDate}
                    onChange={handleEducationChange}
                  />
                </div>
              </div>
              <label className="block mb-2 text-sm font-medium text-white">
                End date
              </label>
              <div className="flex justify-between w-full items-center">
                <div>
                  <input
                    className="text-black"
                    type="date"
                    name="endDate"
                    value={education.endDate}
                    onChange={handleEducationChange}
                  />
                </div>
              </div>
            </>
          )}
          {editFieldName === "projects" && (
            <>
              <h1 className="self-start text-2xl font-extrabold pl-1 my-5">
                Add Project
              </h1>
              <label className="block mb-2 text-sm font-medium text-white">
                Title
              </label>
              <input
                name="title"
                value={projects.title}
                onChange={handleProjectChange}
                className="bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
              />
              <label className="block mb-2 text-sm font-medium text-white">
                description
              </label>
              <input
                name="description"
                value={projects.description}
                onChange={handleProjectChange}
                className="bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
              />
              <label className="block mb-2 text-sm font-medium text-white">
                Github URL
              </label>
              <input
                name="githubURL"
                value={projects.githubURL}
                onChange={handleProjectChange}
                className="bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
              />
              <label className="block mb-2 text-sm font-medium text-white">
                Live URL
              </label>
              <input
                name="liveURL"
                value={projects.liveURL}
                onChange={handleProjectChange}
                className="bg-black text-white text-sm rounded-lg w-full p-2.5 border-blue-100 border-2"
              />
              <label className="block mb-2 text-sm font-medium text-white">
                Start date
              </label>
              <div className="flex justify-between w-full items-center">
                <div>
                  <input
                    className="text-black"
                    name="startDate"
                    value={projects.startDate}
                    onChange={handleProjectChange}
                    type="date"
                  />
                </div>
              </div>
              <label className="block mb-2 text-sm font-medium text-white">
                End date
              </label>
              <div className="flex justify-between w-full items-center">
                <div>
                  <input
                    className="text-black"
                    name="endDate"
                    value={projects.endDate}
                    onChange={handleProjectChange}
                    type="date"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex w-full h-24 justify-end items-end">
            <button
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-5"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancal
            </button>
            <button
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => {
                updateProfile();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
