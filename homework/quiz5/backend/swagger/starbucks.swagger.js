/**
 * @swagger
 * /starbucks:
 *   get:
 *     summary: 커피 메뉴 리스트 가져오기
 *     tags: [Starbucks]
 *     parameters:
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 아메리카노1
 *                   kcal:
 *                     type: int
 *                     example: 5
 */
