import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios.js";
import { useAuthStore } from "@/store/auth-slice";
import toast from "react-hot-toast";

const ExaminationPage = () => {
  const { id } = useParams();
  const { authUser, idToken } = useAuthStore();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]); // Stores updated answers from backend
  const [localAnswer, setLocalAnswer] = useState(null); // Stores unsent answer
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();
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
          isMultiple,
          answerId: updatedAnswerIds,
          paragraphAnswer: "",
          type,
        };
      }
      return {
        questionId,
        isMultiple,
        answerId: [answerId],
        paragraphAnswer: paragraphAnswer || "",
        type,
      };
    });
  };

  // ✅ Saves answer to backend when clicking "Next"
  const handleNext = async () => {
    if (localAnswer) {
      try {
        const response = await axiosInstance.post(
          `/assess/save-answer`,
          { ...localAnswer, testId: id, userId: authUser._id },
          { headers: { Authorization: `Bearer ${idToken}` } }
        );

        if (response.status === 200) {
          setAnswers(response.data.answers); // Update stored answers
          setLocalAnswer(null); // Clear only after successful save
        }
      } catch (error) {
        toast.error("Failed to save answer.");
      }
    }

    if (currentQuestionIndex < assessment.questions.length - 1) {
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

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      const res = await axiosInstance.post(
        `/assess/save-answer`,
        { ...localAnswer, testId: id, userId: authUser._id },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (res.status === 200) {
        setAnswers(res.data.answers); // Update stored answers
        setLocalAnswer(null); // Clear only after successful save
      }
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
  const question = assessment.questions[currentQuestionIndex];
  const currentAnswer =
    answers.find((ans) => ans.questionId === question._id) || localAnswer || {};

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
          <span className="text-lg font-bold">
            Question {currentQuestionIndex + 1}/{assessment.questions.length}
          </span>
        </header>

        {/* Exam Content */}
        <div className="flex flex-1">
          {/* Left Column */}
          <div className="w-1/2 p-6 border-r">
            {question.paragraph && (
              <div className="bg-white p-4 rounded">
                <h2 className="font-bold text-lg">📖 Read the Paragraph</h2>
                <p>{question.paragraph}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-1/2 p-6 border-r">
            {question.type === "mcq" ? (
              <div>
                <h2 className="text-2xl font-semibold">{question.question} ?</h2>
                <div className="mt-4">
                  {question.choices.map((choice) => (
                    <label
                      key={choice._id}
                      className="block bg-white p-3 rounded cursor-pointer"
                    >
                      <input
                        type={question.isMultiple ? "checkbox" : "radio"}
                        name={`question_${question._id}`}
                        value={choice._id}
                        checked={currentAnswer?.answerId?.includes(choice._id)}
                        onChange={() =>
                          handleAnswerUpdate(
                            question._id,
                            question.isMultiple,
                            choice._id,
                            "",
                            question.type
                          )
                        }
                      />
                      {choice.text}
                    </label>
                  ))}
                </div>
              </div>
            ) : (<>
            <h2 className="text-2xl font-semibold mb-3">{question.question} ?</h2>
              <textarea
                className="w-full h-40 p-3 border rounded"
                placeholder="Type your answer here..."
                value={currentAnswer?.paragraphAnswer || ""}
                onChange={(e) =>
                  handleAnswerUpdate(question._id, false, "", e.target.value,question.type)
                }
              /></>
              
            )}
          </div>

          {/* Question Navigation Panel */}
          <div className="w-1/6 p-4 bg-gray-100 border-l">
            <h3 className="text-lg font-bold mb-2">Questions</h3>
            <div className="grid grid-cols-3 gap-2">
              {assessment.questions.map((q, index) => {
                const isAnswered = isQuestionAnswered(q._id);
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 text-center rounded ${
                      currentQuestionIndex === index
                        ? "bg-blue-600 text-white"
                        : isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <footer className="flex justify-between p-4 bg-white">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
            disabled={currentQuestionIndex === 0}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={
              currentQuestionIndex < assessment.questions.length - 1
                ? handleNext
                : handleSubmitExam
            }
          >
            {currentQuestionIndex < assessment.questions.length - 1
              ? "Next"
              : "Submit"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExaminationPage;
