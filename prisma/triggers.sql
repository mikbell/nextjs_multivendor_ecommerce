-- MySQL trigger to enqueue role changes into role_sync_queue
-- Works when role is updated directly in the DB (e.g., Prisma Studio)

DROP TRIGGER IF EXISTS trg_users_role_change;
DELIMITER $$
CREATE TRIGGER trg_users_role_change
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  IF NOT (NEW.role <=> OLD.role) THEN
    INSERT INTO role_sync_queue (userId, role, enqueuedAt, processed)
    VALUES (NEW.id, NEW.role, NOW(), FALSE)
    ON DUPLICATE KEY UPDATE
      role = VALUES(role),
      enqueuedAt = NOW(),
      processed = FALSE;
  END IF;
END$$
DELIMITER ;
