-- CreateIndex
CREATE INDEX "MentorshipRequest_menteeId_status_idx" ON "MentorshipRequest"("menteeId", "status");

-- CreateIndex
CREATE INDEX "MentorshipRequest_mentorId_status_idx" ON "MentorshipRequest"("mentorId", "status");

-- CreateIndex
CREATE INDEX "Message_requestId_idx" ON "Message"("requestId");

-- CreateIndex
CREATE INDEX "Session_menteeId_status_idx" ON "Session"("menteeId", "status");

-- CreateIndex
CREATE INDEX "Session_mentorId_status_idx" ON "Session"("mentorId", "status");

-- CreateIndex
CREATE INDEX "User_role_name_idx" ON "User"("role", "name");
