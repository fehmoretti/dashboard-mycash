-- ============================================
-- 📦 STORAGE BUCKETS - mycash+ v2.0
-- ============================================
-- Criação de buckets para armazenamento de imagens e arquivos

-- Bucket para avatares (users e family_members)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para logos de contas/cartões
INSERT INTO storage.buckets (id, name, public)
VALUES ('account-logos', 'account-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos e comprovantes (futuro)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 📋 POLÍTICAS DE STORAGE - avatars
-- ============================================
-- Usuários podem fazer upload de seus próprios avatares
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Todos os usuários autenticados podem ver avatares
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Usuários podem atualizar seus próprios avatares
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem deletar seus próprios avatares
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 📋 POLÍTICAS DE STORAGE - account-logos
-- ============================================
CREATE POLICY "Users can upload account logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can view account logos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'account-logos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own account logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own account logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'account-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 📋 POLÍTICAS DE STORAGE - documents
-- ============================================
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
