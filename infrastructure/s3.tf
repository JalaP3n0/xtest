# S3 bucket for EventOps AI media storage
resource "aws_s3_bucket" "media" {
  bucket = "eventops-ai-media-${var.environment}"
}

# Lifecycle policy for 90-day media deletion
resource "aws_s3_bucket_lifecycle_configuration" "media_lifecycle" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "expire-media-after-90-days"
    status = "Enabled"

    expiration {
      days = 90
    }

    # Targeted specifically to check-in photos and chat media
    filter {
      and {
        prefix = "uploads/"
      }
    }
  }
}

# Access control and encryption for security-first compliance
resource "aws_s3_bucket_public_access_block" "media_privacy" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media_encryption" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
