"use client";

import { Label } from "@/components/ui/label";
import { initialSignUpFormData, userRegistrationFormControls } from "../utils";
import CommonFormElement from "@/components/form-element/page";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { registerUserAction } from "@/actions";
import { useRouter } from "next/router";

export default function SignUp() {
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const router = useRouter();

  function handleSubmitBtnValid() {
    return Object.keys(signUpFormData).every(
      (key) => signUpFormData[key].trim() !== ""
    );
  }

  async function handleSignUp() {
    const result = await registerUserAction(signUpFormData);
  }

  return (
    <div>
      <h1>User Registration</h1>
      <form action={handleSignUp}>
        {userRegistrationFormControls.map((controlItem) => (
          <div key={controlItem.name}>
            <Label>{controlItem.label}</Label>
            <CommonFormElement
              value={signUpFormData[controlItem.name]}
              currentItem={controlItem}
              onChange={(event) =>
                setSignUpFormData({
                  ...signUpFormData,
                  [event.target.name]: event.target.value,
                })
              }
            />
          </div>
        ))}
        <Button
          type="submit"
          disabled={!handleSubmitBtnValid()}
          className="disabled-opacity-65"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}
