import { FormRow } from "../../projects/document/components";
import Wrapper from "../../projects/document/assets/wrappers/RegisterAndLoginPage";
import { Form, Link, redirect, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../projects/document/utils/customFetch";
import { SmallLogo } from "../../components/Logo";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const res = await customFetch.post("/auth/candidate/login", data);
    const { role, _id } = res.data.user;
    toast.success(res.data.msg);

    if (!role || !_id) {
      toast.error("Invalid response from server. Please try again.");
      return redirect("/truedocs/login");
    }
    localStorage.setItem("credential", JSON.stringify(res.data.user));
    if (role === "hr" || role === "admin") {
      return redirect("/");
    } else if (role === "candidate") {
      return redirect("/");
    } else {
      toast.error("Unknown role. Please contact support.");
      return redirect("/truedocs/login");
    }
  } catch (error) {
    toast.error(error.response?.data?.msg || "Login failed. Try again.");
    return null;
  }
};

const CandidateLogin = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <SmallLogo />
        <p>Candidate Login</p>
        <FormRow
          type="text"
          name="email"
          labelText="Email/Employee ID"
          defaultValue="chandanegc@gmail.com"
        />
        <FormRow type="password" name="password" defaultValue="1234" />
        <button
          className="btn btn-block form-btn"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <p>
         Forgot Password?
          <Link to="/forgot-password" className="member-btn">
            Click Here
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default CandidateLogin;
