import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import profileImg from "../assests/Abdullah.jpg";
import {
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaLocationDot,
  FaPaperPlane,
  FaCheck,
} from "react-icons/fa6";

function ContactMe() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const contactInfo = [
    {
      icon: <FaLocationDot />,
      title: "Location",
      info: "Faisalabad, Pakistan",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      info: "+92 315-6215289",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      info: "abdullahworld111@gmail.com",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      icon: <FaUserTie />,
      title: "Status",
      info: "Available for Work",
      bg: "bg-red-50",
      text: "text-red-600",
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const payload = new FormData(e.target);
      payload.append("access_key", "63021a49-141c-4db8-bf1e-48b6774ea6fa");

      const response = await axios.post(
        "https://api.web3forms.com/submit",
        payload,
      );

      if (!response.data.success) throw new Error(response.data.message);

      setSubmitStatus("success");
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setSubmitStatus("error");
      toast.error("Could not send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(""), 3000);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden my-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-24 w-72 h-72 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-16 left-16 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-12 h-px bg-red-500"></span>
            <span className="text-red-600 text-lg font-semibold tracking-wider">
              CONTACT
            </span>
            <span className="w-12 h-px bg-red-500"></span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Let's Work <span className="text-red-600">Together</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a project or idea? Let's create something impactful and
            user-focused.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-xl">
                <img
                  src={profileImg}
                  alt="Abdullah Khan"
                  className="w-full h-80 object-center rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg">
                <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>

            <div className="space-y-4">
              {contactInfo.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition`}
                >
                  <div className={`p-3 rounded-xl ${c.bg} text-2xl ${c.text}`}>
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {c.title}
                    </h3>
                    <p className="text-gray-600">{c.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send Me a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below — I'll reply within 24 hours.
              </p>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <FaCheck className="text-green-600" />
                  <span className="text-green-700">
                    Message sent successfully!
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+92 300 1234567"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Project inquiry, collaboration, etc."
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell me about your project or idea..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-red-500"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <FaPaperPlane />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactMe;
