import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios.js";
import { useAuthStore } from "@/store/auth-slice";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import SecurityLayout from "./Security";

const ExaminationPage = () => {
  const { id } = useParams();
  const { authUser, idToken } = useAuthStore();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]); // Stores updated answers from backend
  const [localAnswer, setLocalAnswer] = useState(null); // Stores unsent answer
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const navigate = useNavigate();

  const timerRef = useRef(null);

  useEffect(() => {
    if (assessment?.timeLimit !== undefined) {
      setTimeLeft(assessment.timeLimit * 60);
    }
  }, [assessment]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setIsBlinking((prev) => !prev);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitExam();
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const fetchAnswers = async () => {
    try {
      const res = await axiosInstance.get(
        `/assess/answers/${id}/${authUser._id}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (res.status === 200) {
        setAnswers(res.data.answers);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axiosInstance.get(`/assess/s/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (response.status === 200) {
          setAssessment(response.data);
          fetchAnswers();
        }
      } catch (error) {
        toast.error("Failed to load assessment.");
      }
    };
    fetchAssessment();
  }, [id]);

  // ✅ Updates local answer before sending to backend
  const handleAnswerUpdate = (
    questionId,
    isMultiple,
    answerId,
    paragraphAnswer,
    type
  ) => {
    setLocalAnswer((prev) => {
      if (isMultiple) {
        const updatedAnswerIds = prev?.answerId?.includes(answerId)
          ? prev.answerId.filter((id) => id !== answerId) // Remove if already selected
          : [...(prev?.answerId || []), answerId]; // Add new selection

        return {
          questionId,
          isMultiple: true,
          answerId: updatedAnswerIds,
          paragraphAnswer: "",
          type,
        };
      }
      return {
        questionId,
        isMultiple: false,
        answerId: [answerId],
        paragraphAnswer: paragraphAnswer || "",
        type,
      };
    });
  };
  const saveAnswer = async () => {
    if (localAnswer) {
      try {
        const response = await axiosInstance.post(
          `/assess/save-answer`,
          { ...localAnswer, testId: id, userId: authUser._id },
          { headers: { Authorization: `Bearer ${idToken}` } }
        );

        if (response.status === 200) {
          toast.success("Answer saved successfully");
          setAnswers(response.data.answers); // Update stored answers
          setLocalAnswer(null); // Clear only after successful save
        }
      } catch (error) {
        toast.error("Failed to save answer.");
      }
    }
  };
  // ✅ Saves answer to backend when clicking "Next"
  const handleNext = async () => {
    saveAnswer();

    const category = assessment?.questions[currentCategoryIndex];
    if (category && currentQuestionIndex < category.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const isQuestionAnswered = (questionId) => {
    return answers.some(
      (answer) =>
        answer.questionId === questionId &&
        (answer.answerId.length > 0 || answer.paragraphAnswer !== "")
    );
  };

  const handleNextCategory = () => {
    saveAnswer();
    setCurrentCategoryIndex(currentCategoryIndex + 1); // Move to the next category
    setCurrentQuestionIndex(0); // Start from the first question of the new category
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Move to the previous question in the current category
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      // Move to the previous category and start at the last question of that category
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentQuestionIndex(
        assessment.questions[currentCategoryIndex - 1].questions.length - 1
      );
    }
  };

  const handleCategoryChange = (index) => {
    saveAnswer();
    setCurrentCategoryIndex(index);
    setCurrentQuestionIndex(0); // Reset to the first question of the new category
  };

  const handleSubmitExam = async () => {
    try {
      await saveAnswer();
      const payload = {
        testId: id,
        userId: authUser._id,
        answers,
      };

      const response = await axiosInstance.post(`/assess/submit`, payload, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (response.status === 200) {
        toast.success("Exam submitted successfully!");
        navigate("/assessment/s");
      } else {
        toast.error("Failed to submit exam.");
      }
    } catch (error) {
      toast.error("Error submitting exam.");
    }
  };

  if (!assessment) return <p>Loading...</p>;
  console.log(localAnswer);
  const currentCategory = assessment.questions[currentCategoryIndex];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];
  const currentAnswer =
    answers.find((ans) => ans.questionId === currentQuestion._id) ||
    localAnswer ||
    {};

  return (
    <SecurityLayout testId={id} userId={authUser._id}>
    <div className="relative flex h-screen bg-gray-900 text-white">
      {/* Floating Monitoring Alert */}
      <div
        className={`absolute top-4 right-4 flex items-center gap-2  ${
          isBlinking ? "animate-blink text-white" : "bg-red-400 text-black"
        }  px-4 py-2 rounded-lg shadow-lg`}
      >
        <Eye size={18} />
        {/* <span className={`text-sm font-semibold`}></span> */}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-around items-center p-4 bg-red-700/90 text-white shadow-xl">
          <div>
            <h1 className="font-extrabold text-3xl">
              {assessment?.assessmentTitle || "Unknown Assessment"}
            </h1>
          </div>
        </header>

        {/* Exam Content */}
        <div className="flex flex-1 p-4 gap-6">
          {/* Left Column - Paragraph/Image */}
          <div className="w-1/2 bg-gray-800/60 p-6 rounded-lg shadow-lg h-full overflow-y-auto">
            {currentQuestion.imageUrl && (
              <img
                src={currentQuestion.imageUrl}
                alt="Question"
                className="rounded-lg shadow-lg mb-4"
              />
            )}
            {currentQuestion.paragraph && (
              <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="font-bold text-lg text-yellow-400">
                  📖 Read Carefully
                </h2>
                <p className="text-gray-300">{currentQuestion.paragraph}</p>
              </div>
            )}
          </div>

          {/* Right Column - Questions & Answers */}
          <div className="w-1/2 bg-gray-800/60 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
              {currentQuestion.question}?
            </h2>
            {currentQuestion.type === "mcq" ? (
              <div className="space-y-3">
                {currentQuestion.choices.map((choice) => (
                  <label
                    key={choice._id}
                    className="flex items-center gap-2 bg-gray-700/70 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                  >
                    <input
                      type={currentQuestion.isMultiple ? "checkbox" : "radio"}
                      name={`question_${currentQuestion._id}`}
                      value={choice._id}
                      checked={currentAnswer?.answerId?.includes(choice._id)}
                      onChange={() =>
                        handleAnswerUpdate(
                          currentQuestion._id,
                          currentQuestion.isMultiple,
                          choice._id,
                          "",
                          currentQuestion.type
                        )
                      }
                      className="accent-yellow-400"
                    />
                    <span>{choice.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full h-40 p-3 bg-gray-700/70 border border-gray-500 rounded-lg placeholder-gray-400"
                placeholder="Type your answer..."
                value={currentAnswer?.paragraphAnswer || ""}
                onChange={(e) =>
                  handleAnswerUpdate(
                    currentQuestion._id,
                    false,
                    "",
                    e.target.value,
                    currentQuestion.type
                  )
                }
              />
            )}
          </div>

          {/* Question Navigation Panel */}
          <div className="w-1/5 bg-gray-900 p-4 rounded-lg shadow-xl flex flex-col justify-between gap-4 h-full overflow-y-auto">
            {/* User Info Section */}

            <div className="flex flex-col gap-2">
              <span className="text-lg font-bold tracking-wide">
                Question {currentQuestionIndex + 1}/
                {currentCategory.questions.length}
              </span>
              <span
                className={`flex p-3 items-center justify-center gap-2 text-lg font-bold ${
                  isBlinking ? "animate-blink" : "bg-red-700"
                }`}
              >
                ⏳ Time Left:{" "}
                {timeLeft !== null ? (
                  <>
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </>
                ) : (
                  "Loading..."
                )}
              </span>
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg shadow-md mt-5">
                <img
                  src={authUser.photoURL}
                  alt="User Profile"
                  className="w-12 h-12 rounded-full border-2 border-yellow-400"
                />
                <div>
                  <h3 className="text-white font-semibold">
                    {authUser.fullName}
                  </h3>
                  <p className="text-sm text-gray-400">{authUser.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {assessment.questions.map((category, index) => (
                  <button
                    key={category.categoryName}
                    onClick={() => handleCategoryChange(index)}
                    className={`w-full p-2 text-lg font-semibold rounded-lg ${
                      currentCategoryIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    if (window.electron) {
                      window.electron.exitApp(); // Exit Electron App
                    } else {
                      navigate(-1); // Navigate back in browser mode
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md flex items-center"
                >
                  <span className="ml-2">Exit</span>
                </button>
              </div>
              <div className="mb-20 bg-gray-800/60 p-5 rounded-lg ">
                <h3 className="text-lg font-bold mb-2 text-yellow-400">
                  Questions
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {currentCategory.questions.map((q, index) => {
                    const isAnswered = isQuestionAnswered(q._id);
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-10 h-10 flex items-center justify-center text-center rounded-lg transition font-semibold shadow-md ${
                          currentQuestionIndex === index
                            ? "bg-blue-500 text-white"
                            : isAnswered
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {isAnswered ? <CheckCircle size={16} /> : index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="flex flex-row justify-between bg-gray-800/30 p-5 rounded-lg">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition hover:bg-gray-600"
                disabled={
                  currentCategoryIndex === 0 && currentQuestionIndex === 0
                }
                onClick={handlePrevious}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 transition hover:bg-blue-500"
                onClick={
                  currentQuestionIndex <
                  assessment.questions[currentCategoryIndex].questions.length -
                    1
                    ? handleNext
                    : currentCategoryIndex < assessment.questions.length - 1
                    ? handleNextCategory
                    : handleSubmitExam
                }
              >
                {currentQuestionIndex <
                assessment.questions[currentCategoryIndex].questions.length -
                  1 ? (
                  <>
                    Next <ChevronRight size={16} />
                  </>
                ) : currentCategoryIndex < assessment.questions.length - 1 ? (
                  <>
                    Next Category <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    Submit <AlertCircle size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Navigation Controls */}
          </div>
        </div>
      </div>
    </div>
    </SecurityLayout>

  );
};

export default ExaminationPage;
