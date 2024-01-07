import userRouter from "./api/controllers/user/router";
import schoolRouter from "./api/controllers/school/router";
import classRouter from "./api/controllers/class/router";
import studentRouter from "./api/controllers/student/router";

export default function routes(app) {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/school", schoolRouter);
  app.use("/api/v1/class", classRouter);
  app.use("/api/v1/student", studentRouter);
}
