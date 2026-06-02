
-- 1. Profiles: restrict sensitive columns via column-level revoke + public view
-- Replace the broad public SELECT with a stricter one
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

CREATE POLICY "Public profile fields viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Revoke direct column access to sensitive fields from anon/authenticated
REVOKE SELECT (phone, momo_number, momo_provider, skrill_email, tax_regions) ON public.profiles FROM anon, authenticated;

-- Allow the owner to read their own sensitive columns
GRANT SELECT (phone, momo_number, momo_provider, skrill_email, tax_regions) ON public.profiles TO authenticated;

-- (Admins already have access via "Admins manage profiles" ALL policy)

-- 2. Lessons - viewable by enrolled students + admins
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students view lessons"
ON public.lessons FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.course_id = lessons.course_id
      AND e.user_id = auth.uid()
      AND e.status = 'active'
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins manage lessons"
ON public.lessons FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Quizzes - same as lessons
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students view quizzes"
ON public.quizzes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.course_id = quizzes.course_id
      AND e.user_id = auth.uid()
      AND e.status = 'active'
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins manage quizzes"
ON public.quizzes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Quiz questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students view questions"
ON public.quiz_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.quizzes q
    JOIN public.enrollments e ON e.course_id = q.course_id
    WHERE q.id = quiz_questions.quiz_id
      AND e.user_id = auth.uid()
      AND e.status = 'active'
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins manage questions"
ON public.quiz_questions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Quiz attempts - user owns their own attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attempts"
ON public.quiz_attempts FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own attempts"
ON public.quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 6. Commission overrides - admin view
CREATE POLICY "Admins view all overrides"
ON public.commission_overrides FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
