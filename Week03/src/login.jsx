
import React, { useState } from "react";
import "./login.css";

export default function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("ID:", id);
        console.log("PASSWORD:", password);
        console.log("이름:", name);
        console.log("전화번호:", phone);
    };

    return (
        <div className="login-page">
            <h1 className="login-title">Login</h1>

            <form className="login-form-wrapper" onSubmit={handleSubmit}>
                <div className="login-form">
                    <div className="login-id-password">
                        <label className="login-label" htmlFor="id">
                            ID
                        </label>
                        <input
                            id="id"
                            type="text"
                            className="login-input"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>

                    <div className="login-id-password">
                        <label className="login-label" htmlFor="password">
                            PASSWORD
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="login-id-password">
                        <label className="login-label" htmlFor="name">
                            이름
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="login-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="login-id-password">
                        <label className="login-label" htmlFor="phone">
                            전화번호
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            className="login-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="login-button">
                    로그인
                </button>
            </form>
        </div>
    );
}